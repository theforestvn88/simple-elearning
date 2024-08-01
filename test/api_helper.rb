def sign_in(email, password)
    post api_auth_login_url, params: { email: email, password: password }, as: :json
    assert_response :success
    token = response.parsed_body['token']
end

def log_out(token)
    delete api_auth_logout_url, headers: { "X-Auth-Token" => "Bearer #{token}" }
    assert_response :success
end

def user_sign_in(user)
    sign_in(user.email, user.password)
end

def instructor_sign_in(instructor)
    post "/api/auth/instructor/#{instructor.partner.slug}/login", params: { email: instructor.email, password: instructor.password }, as: :json
    assert_response :success
    token = response.parsed_body['token']
end