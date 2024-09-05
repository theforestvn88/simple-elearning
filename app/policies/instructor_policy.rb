# frozen_string_literal: true

class InstructorPolicy < UserPolicy
    include Helpers::InstructorUser

    def create?
        partner_admin? && !partner_admin?(@record)
    end

    def update?
        (is_same_user? && !@record.rank_changed?) || (partner_admin? && !partner_admin?(@record))
    end

    def destroy?
        partner_admin? && !partner_admin?(@record)   
    end
end
