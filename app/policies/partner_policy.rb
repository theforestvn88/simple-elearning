# frozen_string_literal: true

class PartnerPolicy < ApplicationPolicy
    include Helpers::InstructorUser
    
    def show?
        true
    end

    def update?
        instructor? && administrator? && @user&.partner_id == @record.id
    end
end
