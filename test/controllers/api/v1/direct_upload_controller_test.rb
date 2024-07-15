require 'test_helper'

class ApiV1DirectUploadControllerTest < ActionDispatch::IntegrationTest
    setup do
        @user = create(:user)
        @other = create(:user)
    end

    test 'user could get direct-upload-url for his profile avatar' do
        post api_auth_login_url, params: { email: @user.email, password: '0123456789' }, as: :json
        assert_response :success
        token = response.parsed_body['token']

        avatar_file = fixture_file_upload(Rails.root.join('test', 'fixtures', 'files', 'images', 'test_img.png'), 'image/png')

        post api_v1_presigned_url_path(format: :json), 
            headers: { 
                "X-Auth-Token" => "Bearer #{token}",
            }, 
            params: { 
                blob: { 
                    "filename": "test_upload",
                    "byte_size": 67969,
                    "checksum": "VtVrTvbyW7L2DOsRBsh0UQ==",
                    "content_type": "application/pdf",
                    "metadata": {
                        "message": "active_storage_test"
                    }
                } 
            }, as: :json

        assert_response :success
        assert response.parsed_body["direct_upload"]["url"].present?
    end

    test 'anynomous should be prevent' do
        avatar_file = fixture_file_upload(Rails.root.join('test', 'fixtures', 'files', 'images', 'test_img.png'), 'image/png')

        post api_v1_presigned_url_path(format: :json), 
            headers: { 
                "X-Auth-Token" => "Bearer fake-token",
            }, 
            params: { 
                blob: { 
                    "filename": "test_upload",
                    "byte_size": 67969,
                    "checksum": "VtVrTvbyW7L2DOsRBsh0UQ==",
                    "content_type": "application/pdf",
                    "metadata": {
                        "message": "active_storage_test"
                    }
                } 
            }, as: :json

        assert_response :unauthorized
    end
end
