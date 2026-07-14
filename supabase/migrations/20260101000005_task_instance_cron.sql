-- Rolling 30-day task instance generation via pg_cron

CREATE OR REPLACE FUNCTION public.generate_task_instances_for_user(p_user_id UUID)
RETURNS void AS $$
DECLARE
  r RECORD;
  d DATE;
  end_date DATE := (CURRENT_DATE AT TIME ZONE 'UTC')::date + 30;
  rot_idx INT;
  resolved_title TEXT;
BEGIN
  FOR r IN
    SELECT * FROM public.recurrence_rules
    WHERE user_id = p_user_id AND active = true
  LOOP
    d := (CURRENT_DATE AT TIME ZONE 'UTC')::date;
    rot_idx := 0;
    WHILE d <= end_date LOOP
      IF to_char(d, 'dy') = ANY(r.days_of_week) OR
         lower(trim(to_char(d, 'Dy'))) = ANY(r.days_of_week) THEN
        IF NOT EXISTS (
          SELECT 1 FROM public.task_instances ti
          WHERE ti.recurrence_rule_id = r.id AND ti.scheduled_date = d
        ) THEN
          resolved_title := r.title_template;
          IF r.rotation_set IS NOT NULL AND jsonb_array_length(r.rotation_set) > 0 THEN
            resolved_title := replace(
              replace(
                r.title_template,
                '{split_day}',
                r.rotation_set ->> (rot_idx % jsonb_array_length(r.rotation_set))::int
              ),
              '{theme}',
              r.rotation_set ->> (rot_idx % jsonb_array_length(r.rotation_set))::int
            );
          END IF;

          INSERT INTO public.task_instances (
            user_id, goal_id, recurrence_rule_id, title,
            scheduled_date, start_time, duration_minutes, status
          ) VALUES (
            p_user_id, r.goal_id, r.id, resolved_title,
            d, r.start_time, r.duration_minutes, 'pending'
          );
        END IF;
      END IF;
      IF extract(dow FROM d) = 0 THEN
        rot_idx := rot_idx + 1;
      END IF;
      d := d + 1;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.generate_all_task_instances()
RETURNS void AS $$
DECLARE
  u RECORD;
BEGIN
  FOR u IN SELECT id FROM public.users WHERE onboarding_completed = true LOOP
    PERFORM public.generate_task_instances_for_user(u.id);
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- pg_cron schedule (run nightly at 02:00 UTC)
-- SELECT cron.schedule('generate-task-instances', '0 2 * * *', 'SELECT public.generate_all_task_instances()');
