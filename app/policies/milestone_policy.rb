class MilestonePolicy < ApplicationPolicy
    def create?
        can_modify_course?
    end

    def update?
        can_modify_course?
    end

    def destroy?
        can_modify_course?
    end

    private

        def belong_to_same_partner?
            @user&.partner_id == @record.course.partner_id
        end

        def assigned_instructor?
            @user.is_a?(::Instructor) &&
            (
                true ||# TODO: check assignment
                administrator?
            )

        end

        def administrator?
            @user.administrator?
        end

        def can_modify_course?
            assigned_instructor? && belong_to_same_partner?
        end
end
