class CourseTrackingService
    def track_create_course(course:, by:)
        Activity.create(action: 'create', trackable: course, actor: by)
    end

    def track_update_course(course:, by:)
        action = "update|#{what_changed?(course).join(',')}"
        Activity.create(action: action, trackable: course, actor: by)
    end

    def track_destroy_course(course:, by:)
        Activity.create(action: 'destroy', trackable: course, actor: by)
    end

    def track_create_milestone(milestone:, by:)
        course = milestone.course
        Activity.create(action: "add_milestone|#{milestone.id}", trackable: course, actor: by)
    end

    def track_update_milestone(milestone:, by:)
        action = "update_milestone|#{what_changed?(milestone).join(',')}"
        Activity.create(action: action, trackable: milestone.course, actor: by)
    end

    def track_destroy_milestone(milestone:, by:)
        action = "destroy_milestone|#{milestone.id}"
        Activity.create(action: action, trackable: milestone.course, actor: by)
    end

    def track_create_lesson(lesson:, by:)
        Activity.create(action: "add_lesson|#{lesson.id}", trackable: lesson.course, actor: by)
    end

    def track_update_lesson(lesson:, by:)
        action = "update_lesson|#{what_changed?(lesson).join(',')}"
        Activity.create(action: action, trackable: lesson.course, actor: by)
    end

    def track_destroy_lesson(lesson:, by:)
        action = "destroy_lesson|#{lesson.id}"
        Activity.create(action: action, trackable: lesson.course, actor: by)
    end

    private

        def what_changed?(model)
            model.previous_changes.except(:updated_at, :created_at).keys
        end
end
