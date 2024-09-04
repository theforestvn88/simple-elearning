# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
    def show?
        true
    end

    def update?
        is_same_user?
    end

    def destroy?
        is_same_user?
    end

    private

        def is_same_user?
            @user && (@user.id == @record.id)
        end
end
