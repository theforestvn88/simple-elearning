require "test_helper"
require_relative "./shared/send_email_tests"

class PartnerMailerTest < ActionMailer::TestCase
  include ::Shared::SendEmailTests

  setup do
      @partner = create(:partner)
  end

  test 'inform new partner' do
      mailer = ::PartnerMailer.with(partner: @partner, admin_random_password: 'xxxxxx').inform_new_partner
      assert_send_email(from_mailer: mailer, to: [@partner.email], with_subject: 'Inform New Partner')
  end
end
