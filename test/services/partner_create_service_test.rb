require 'test_helper'

class PartnerCreateServiceTest < ActiveSupport::TestCase
    setup do
        @subject = ::PartnerCreateService.new
    end

    test 'require email and name' do
        assert_no_difference("Partner.count") do
            result = @subject.call(email: '', name: 'partner')
            assert !result.success
            
            result = @subject.call(email: 'partner@example.com', name: '')
            assert !result.success
        end
    end

    test 'auto create administrator instructor for partner' do
        assert_difference("Partner.count") do
            result = @subject.call(email: 'partner@example.com', name: 'partner')
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
            @subject.call(email: 'partner@example.com', name: 'partner')
        end

        mock_partner_mailer.verify
    end
end
