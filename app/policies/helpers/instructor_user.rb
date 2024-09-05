# frozen_string_literal: true

module Helpers
    module InstructorUser
        extend ActiveSupport::Concern

        def belong_to_same_partner?
            @user && @user.partner_id == @record.partner_id
        end

        def instructor?(x = @user)
            x && x.is_a?(::Instructor)
        end

        def administrator?(x = @user)
            x && x.administrator?
        end

        def partner_instructor?(x = @user)
            instructor?(x) && belong_to_same_partner?
        end

        def partner_admin?(x = @user)
            partner_instructor?(x) && administrator?(x)
        end
    end
end
