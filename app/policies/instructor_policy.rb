# frozen_string_literal: true

class InstructorPolicy < UserPolicy
    include Helpers::InstructorUser

    def destroy?
        partner_admin?    
    end
end
