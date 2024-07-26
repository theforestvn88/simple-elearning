require "test_helper"
require_relative "./shared/send_email_tests"

class InstructorMailerTest < ActionMailer::TestCase
  include ::Shared::SendEmailTests
  
  setup do
    @instructor = create(:instructor)
  end

  test 'email account verification' do
      mailer = InstructorMailer.with(instructor: @instructor, random_password: 'xxxxxxxxxxx').inform_new_account
      assert_send_email(from_mailer: mailer, to: [@instructor.email], with_subject: 'Inform New Account')
  end
end
