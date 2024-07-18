ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'
require "minitest/mock"

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    # Add more helper methods to be used by all tests here...
    include FactoryBot::Syntax::Methods
  end
end

Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :minitest
    with.library :rails
  end
end

# policy test helper
def permit_policy?(user, record, action)
  cls = self.class.to_s.gsub(/Test/, '')
  cls.constantize.new(user, record).public_send("#{action.to_s}?")
end

def assert_permit_policy(user, record, action)
  msg = "User #{user.inspect} should be permitted to #{action} #{record}, but isn't permitted"
  assert permit_policy?(user, record, action), msg
end

def refute_permit_policy(user, record, action)
  msg = "User #{user.inspect} should NOT be permitted to #{action} #{record}, but is permitted"
  refute permit_policy?(user, record, action), msg
end
