require "test_helper"

module Shared
    module SendEmailTests
        extend ActiveSupport::Concern

        included do
            def assert_send_email(from_mailer:, to:, with_subject:)
                assert_equal from_mailer.subject, with_subject
                assert_equal from_mailer.to, Array(to)
            end
        end
    end
end
