require 'test_helper'
require 'api_helper'

class ApiV1PartnerPartnersControllerTest < ActionDispatch::IntegrationTest
    setup do
        @partner = create(:partner)
        @admin = create(:instructor, partner: @partner, rank: :administrator)
        @instructor2 = create(:instructor, partner: @partner, rank: :professor)
    end

    test 'get partner' do
        get api_v1_partner_path(identify: @partner.slug), as: :json
        
        assert_response :success
        assert_equal response.parsed_body, {
            'name' => @partner.name,
            'can_edit' => nil
        }
    end

    test 'get partner as admin' do
        token = instructor_sign_in(@admin)

        get api_v1_partner_path(identify: @partner.slug), headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        
        assert_response :success
        assert_equal response.parsed_body, {
            'name' => @partner.name,
            'can_edit' => true
        }
    end

    test 'verify partner policy when udpate' do
        token = instructor_sign_in(@admin)
        policy_mock = Minitest::Mock.new
        policy_mock.expect :update?, true, []

        PartnerPolicy.stub :new, policy_mock do
            put api_v1_partner_update_path(identify: @partner.slug), 
                 headers: { "X-Auth-Token" => "Bearer #{token}" }, 
                 params: { 
                    partner: { 
                        name: 'updated name',
                    } 
                }, 
                as: :json
        end

        policy_mock.verify
    end

    test 'update partner info' do
        token = instructor_sign_in(@admin)

        put api_v1_partner_update_path(identify: @partner.slug), 
            headers: { "X-Auth-Token" => "Bearer #{token}" }, 
            params: { 
                partner: { 
                    name: 'updated name',
                } 
            }, 
            as: :json

        assert_response :success
        assert_equal response.parsed_body, {
            'name' => 'updated name',
            'can_edit' => true
        }
    end
end
