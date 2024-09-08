json.extract! @session, :token, :token_expire_at

if user = @session.user
    json.partial! 'api/auth/shared/user', user: user
end
