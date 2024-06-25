require 'test_helper'

class TokenBaseAuthServiceTest < ActiveSupport::TestCase
    setup do
        @pass = '0123456789'.freeze
        @user = create(:user, password: @pass, password_confirmation: @pass)
        @subject = ::TokenBaseAuthService.new
    end

    test 'log in' do
        token = 'xxx'

        mock_token_service = Minitest::Mock.new
        mock_token_service.expect :encode, token, [Object]
        
        mock_token_cache_store = Minitest::Mock.new
        mock_token_cache_store.expect :save, nil, [token], expires_at: Time

        ::TokenService.stub :new, mock_token_service do
            ::TokenCacheStore.stub :new, mock_token_cache_store do
                @subject.login(@user.email, @pass)
            end
        end

        mock_token_service.verify
        mock_token_cache_store.verify
    end

    test 'log out' do
        token = 'xxx'
        mock_token_cache_store = Minitest::Mock.new
        mock_token_cache_store.expect :delete, nil, [token]

        ::TokenCacheStore.stub :new, mock_token_cache_store do
            @subject.logout(token)
        end

        mock_token_cache_store.verify
    end

    test 'register' do
        token = 'xxx'

        mock_token_service = Minitest::Mock.new
        mock_token_service.expect :encode, token, [Object]
        
        mock_token_cache_store = Minitest::Mock.new
        mock_token_cache_store.expect :save, nil, [token], expires_at: Time

        assert_difference("User.count") do
            ::TokenService.stub :new, mock_token_service do
                ::TokenCacheStore.stub :new, mock_token_cache_store do
                    @subject.register(email: 'tester111@example.com', password: @pass, password_confirmation: @pass, name: 'tester')
                end
            end
        end

        mock_token_service.verify
        mock_token_cache_store.verify
    end

    test 'get authorized user from valid token' do
        token = 'xxx'
        payload = {
            user_id: @user.id,
            expire: 1.day.from_now.to_s
        }

        mock_token_service = Minitest::Mock.new
        mock_token_service.expect :decode, payload, [token]
        
        mock_token_cache_store = Minitest::Mock.new
        mock_token_cache_store.expect :exist?, true, [token]

        ::TokenService.stub :new, mock_token_service do
            ::TokenCacheStore.stub :new, mock_token_cache_store do
                result = @subject.authorized_user(token)
                assert_equal result, @user
            end
        end
    end

    test 'get nil user from invalid token' do
        token = 'xxx'
        mock_token_cache_store = Minitest::Mock.new
        mock_token_cache_store.expect :exist?, false, [token]

        ::TokenCacheStore.stub :new, mock_token_cache_store do
            result = @subject.authorized_user(token)
            assert_nil result
        end
    end

    test 'get nil user from outdated token' do
        token = 'xxx'
        payload = {
            user_id: @user.id,
            expire: 1.day.ago.to_s
        }

        mock_token_service = Minitest::Mock.new
        mock_token_service.expect :decode, payload, [token]
        
        mock_token_cache_store = Minitest::Mock.new
        mock_token_cache_store.expect :exist?, true, [token]

        ::TokenService.stub :new, mock_token_service do
            ::TokenCacheStore.stub :new, mock_token_cache_store do
                result = @subject.authorized_user(token)
                assert_nil result
            end
        end
    end
end
