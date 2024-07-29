require 'test_helper'

class PartnerCreateServiceTest < ActiveSupport::TestCase
    setup do
        @subject = ::PartnerCreateService.new
        @valid_params = {email: 'partner@example.com', name: 'partner', slug: 'partner-slug'}
    end

    test 'require email and name and slug' do
        assert_no_difference("Partner.count") do
            invalid_params = {email: '', name: 'partner', slug: 'partner-slug'}
            result = @subject.call(invalid_params)
            assert !result.success
            
            invalid_params = {email: 'partner@example.com', name: '', slug: 'partner-slug'}
            result = @subject.call(invalid_params)
            assert !result.success

            invalid_params = {email: 'partner@example.com', name: 'partner', slug: ''}
            result = @subject.call(invalid_params)
            assert !result.success
        end
    end

    test 'auto create administrator instructor for partner' do
        assert_difference("Partner.count") do
            result = @subject.call(@valid_params)
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
            @subject.call(@valid_params)
        end

        mock_partner_mailer.verify
    end
end
