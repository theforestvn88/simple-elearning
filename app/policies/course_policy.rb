class CoursePolicy < ApplicationPolicy
    def create?
        @user.administrator?
    end

    def show?
        belong_to_same_partner?
    end

    def update?
        belong_to_same_partner?
    end

    def destroy?
        @user.administrator? && belong_to_same_partner?
    end

    private

        def belong_to_same_partner?
            @user&.partner_id == @record.partner_id
        end
end
