require 'test_helper'
require 'api_helper'

class ApiV1DirectUploadControllerTest < ActionDispatch::IntegrationTest
    setup do
        @partner = create(:partner)
        @instructor = create(:instructor, partner: @partner)
        @user = create(:user)
    end

    test 'instructor could get direct-upload-url' do
        token = instructor_sign_in(@instructor)

        avatar_file = fixture_file_upload(Rails.root.join('test', 'fixtures', 'files', 'images', 'test_img.png'), 'image/png')

        post api_v1_instructor_presigned_url_path(identify: 'test', format: :json), 
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

    test 'user should be prevent' do
        token = user_sign_in(@user)

        avatar_file = fixture_file_upload(Rails.root.join('test', 'fixtures', 'files', 'images', 'test_img.png'), 'image/png')

        post api_v1_instructor_presigned_url_path(identify: 'test', format: :json), 
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

        assert_response :unauthorized
    end

    test 'anynomous user should be prevent' do
        avatar_file = fixture_file_upload(Rails.root.join('test', 'fixtures', 'files', 'images', 'test_img.png'), 'image/png')

        post api_v1_instructor_presigned_url_path(identify: 'test', format: :json), 
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
