# frozen_string_literal: true

module Helpers
    module InstructorUser
        extend ActiveSupport::Concern

        def belong_to_same_partner?
            @user&.partner_id == @record.partner_id
        end

        def instructor?
            @user.is_a?(::Instructor)
        end

        def administrator?
            @user.administrator?
        end

        def partner_instructor?
            instructor? && belong_to_same_partner?
        end

        def partner_admin?
            partner_instructor? && administrator?
        end
    end
end
