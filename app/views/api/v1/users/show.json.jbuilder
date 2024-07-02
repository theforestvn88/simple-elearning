json.partial! 'api/v1/users/user', user: @user
if @current_user.present? && (user_policy = UserPolicy.new(@current_user, @user))
    json.can_edit user_policy.update?
    json.can_delete user_policy.destroy?
end