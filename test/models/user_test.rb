require "test_helper"

class UserTest < ActiveSupport::TestCase
    context 'auth' do
      should have_secure_password
    end

    context 'valications' do
      should validate_presence_of(:email).on(:create)
      should validate_presence_of(:password).on(:create)
      should validate_presence_of(:password_confirmation).on(:create)
      should validate_presence_of(:name).on(:create)
      should normalize(:email).from(" ME@XYZ.COM\n").to("me@xyz.com")
    end
end
