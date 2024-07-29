require 'test_helper'

class PartnerCreateServiceTest < ActiveSupport::TestCase
    setup do
        @subject = ::PartnerCreateService.new
        @valid_params = {email: 'partner@example.com', name: 'partner', slug: 'partner-slug'}
    end

    test 'require email and name and slug' do
        assert_no_difference("Partner.count") do
            invalid_params = {email: '', name: 'partner', slug: 'partner-slug'}
            result = @subject.create(invalid_params)
            assert !result.success
            
            invalid_params = {email: 'partner@example.com', name: '', slug: 'partner-slug'}
            result = @subject.create(invalid_params)
            assert !result.success

            invalid_params = {email: 'partner@example.com', name: 'partner', slug: ''}
            result = @subject.create(invalid_params)
            assert !result.success
        end
    end

    test 'auto create administrator instructor for partner' do
        assert_difference("Partner.count") do
            result = @subject.create(@valid_params)
            assert result.success
            
            assert result.partner.present?
            assert result.admin_random_password.length >= 10
            assert result.partner.instructors.first.administrator?
        end
    end

    test 'send email to partner' do
        mock_partner_mailer = Minitest::Mock.new
        mock_partner_mailer.expect :inform_new_partner, mock_partner_mailer, []
        mock_partner_mailer.expect :deliver_later, nil, []

        ::PartnerMailer.stub :with, mock_partner_mailer do
            @subject.create(@valid_params)
        end

        mock_partner_mailer.verify
    end

    test 'should not create partner without an admin account' do
        mock_instructor_creator = Minitest::Mock.new
        mock_instructor_creator.expect :create, ::InstructorCreateService::Result.new(false, ::Instructor.new, nil), [], **{
            email: String, 
            name: String, 
            partner_id: Integer, 
            rank: String, 
            send_email: Object
        }
    

        ::InstructorCreateService.stub :new, mock_instructor_creator do
            assert_no_difference("Partner.count") do
                assert_no_difference("Instructor.count") do
                    @subject.create(@valid_params)
                end
            end
        end
    end
end
