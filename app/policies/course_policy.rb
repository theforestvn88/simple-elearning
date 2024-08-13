class CoursePolicy < ApplicationPolicy
    def create?
        instructor? && administrator?
    end

    def show?
        instructor? && belong_to_same_partner?
    end

    def update?
        instructor? && belong_to_same_partner?
    end

    def destroy?
        instructor? && administrator? && belong_to_same_partner?
    end

    private

        def belong_to_same_partner?
            @user&.partner_id == @record.partner_id
        end

        def instructor?
            @user.is_a?(::Instructor)
        end

        def administrator?
            @user.administrator?
        end
end
