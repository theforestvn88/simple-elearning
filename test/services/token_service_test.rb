require 'test_helper'

class TokenServiceTest < ActiveSupport::TestCase
    setup do
        @subject = ::TokenService.new
    end

    test 'generate token through JWT' do
        payload = {user_id: 1}
        mock = Minitest::Mock.new
        mock.expect :call, nil, [payload, "serect_key", "algorithm"]
        JWT.stub(:encode, mock) do
            @subject.stub(:serect_key, "serect_key") do
                @subject.stub(:algorithm, "algorithm") do
                    @subject.encode(payload)
                end
            end
        end
        mock.verify
    end

    test 'decode token through JWT' do
        token = 'xxx'
        mock = Minitest::Mock.new
        mock.expect :call, nil, [token, "serect_key", true], algorithm: "algorithm"
        JWT.stub(:decode, mock) do
            @subject.stub(:serect_key, "serect_key") do
                @subject.stub(:algorithm, "algorithm") do
                    @subject.decode(token)
                end
            end
        end
        mock.verify
    end
end
