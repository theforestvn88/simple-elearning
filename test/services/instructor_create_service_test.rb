require 'test_helper'

class InstructorCreateServiceTest < ActiveSupport::TestCase
    setup do
        @subject = ::InstructorCreateService.new
    end

    test 'require email and name' do
        assert_no_difference("Instructor.count") do
            result = @subject.call(email: '', name: 'instructor')
            assert !result.success
            
            result = @subject.call(email: 'instructor@example.com', name: '')
            assert !result.success
        end
    end

    test 'auto generate password' do
        assert_difference("Instructor.count") do
            result = @subject.call(email: 'instructor@example.com', name: 'instructor')
            assert result.success
            assert result.random_password.length >= 10
            assert result.instructor.authenticate(result.random_password)
        end
    end

    test 'send email to instructor' do
        mock_instructor_mailer = Minitest::Mock.new
        mock_instructor_mailer.expect :inform_new_account, mock_instructor_mailer, []
        mock_instructor_mailer.expect :deliver_later, nil, []

        ::InstructorMailer.stub :with, mock_instructor_mailer do
            @subject.call(email: 'instructor@example.com', name: 'instructor')
        end

        mock_instructor_mailer.verify
    end
end
