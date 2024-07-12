require "test_helper"

class SessionTest < ActiveSupport::TestCase
    test 'require token' do
        assert_raises(ArgumentError) do
            Session.new
        end
    end

    test 'require token_expire_at' do
        assert_raises(ArgumentError) do
            Session.new(token: 'xxxxxxxxxxxxxxxx')
        end
    end

    test 'create success' do
        refute_nil Session.new(token: 'xxxxxxxxxxxxxxxx', token_expire_at: 1.day.from_now)
    end
end
