require 'test_helper'

module TokenBaseAuthServiceTests
    extend ActiveSupport::Concern
    
    included do
        test 'log in' do
            token = 'xxx'

            mock_token_service = Minitest::Mock.new
            mock_token_service.expect :encode, token, [Object]
            
            @mock_token_cache_store&.expect :save, nil, [token, @user], expires_at: Time

            ::TokenService.stub :new, mock_token_service do
                ::TokenCacheStore.stub :new, @mock_token_cache_store do
                    Time.stub(:now, t_now_utc = Time.now.utc) do
                        session = @subject.login(@user.email, @pass)
                        assert_equal session.token, token
                        assert_equal session.token_expire_at, t_now_utc + TokenBaseAuthService::TOKEN_LIFE_TIME
                        assert_equal session.user, @user
                    end
                end
            end

            mock_token_service.verify
            @mock_token_cache_store&.verify
        end

        test 'log out' do
            token = 'xxx'
            @mock_token_cache_store&.expect :clear_tokens_by_user, nil, [@user]

            ::TokenCacheStore.stub :new, @mock_token_cache_store do
                @subject.logout(@user, token)
            end

            @mock_token_cache_store&.verify
        end

        test 'get authorized user from valid token' do
            token = 'xxx'
            payload = {
                user_id: @user.id,
                user_type: @user.class.name,
                expire: 1.day.from_now.to_s
            }

            mock_token_service = Minitest::Mock.new
            mock_token_service.expect :decode, payload, [token]
            
            @mock_token_cache_store&.expect :nil?, false, []
            @mock_token_cache_store&.expect :exist?, true, [token]

            ::TokenService.stub :new, mock_token_service do
                ::TokenCacheStore.stub :new, @mock_token_cache_store do
                    result = @subject.authorized_user(token)
                    assert_equal result, @user
                end
            end
        end

        test 'get nil user from invalid token' do
            token = 'xxx'
            @mock_token_cache_store&.expect :nil?, false, []
            @mock_token_cache_store&.expect :exist?, false, [token]

            ::TokenCacheStore.stub :new, @mock_token_cache_store do
                result = @subject.authorized_user(token)
                assert_nil result
            end
        end

        test 'get nil user from outdated token' do
            token = 'xxx'
            payload = {
                user_id: @user.id,
                user_type: @user.class.name,
                expire: 1.day.ago.to_s
            }

            mock_token_service = Minitest::Mock.new
            mock_token_service.expect :decode, payload, [token]
            
            @mock_token_cache_store&.expect :nil?, false, []
            @mock_token_cache_store&.expect :exist?, true, [token]

            ::TokenService.stub :new, mock_token_service do
                ::TokenCacheStore.stub :new, @mock_token_cache_store do
                    result = @subject.authorized_user(token)
                    assert_nil result
                end
            end
        end

        test 'refresh token' do
            old_token = 'xxx'
            new_token = 'zzz'

            mock_token_service = Minitest::Mock.new
            mock_token_service.expect :encode, new_token, [Object]
            
            @mock_token_cache_store&.expect :save, nil, [new_token, @user], expires_at: Time
            @mock_token_cache_store&.expect :delete, nil, [old_token]

            ::TokenService.stub :new, mock_token_service do
                ::TokenCacheStore.stub :new, @mock_token_cache_store do
                    Time.stub(:now, t_now_utc = Time.now.utc) do
                        session = @subject.refresh_token(old_token, @user)
                        assert_equal session.token, new_token
                        assert_equal session.token_expire_at, t_now_utc + TokenBaseAuthService::TOKEN_LIFE_TIME
                    end
                end
            end

            mock_token_service.verify
            @mock_token_cache_store&.verify
        end

        test 'clear tokens by user' do
            @mock_token_cache_store&.expect :clear_tokens_by_user, nil, [@user]

            ::TokenCacheStore.stub :new, @mock_token_cache_store do
                @subject.clear_user_tokens(@user)
            end

            @mock_token_cache_store&.verify
        end
    end
end

class SubjectUserTest < ActiveSupport::TestCase
    setup do
        @pass = '0123456789'.freeze
        @user = create(:user, password: @pass, password_confirmation: @pass)
        @subject = ::TokenBaseAuthService.new
    end

    include TokenBaseAuthServiceTests

    test 'register' do
        token = 'xxx'

        mock_token_service = Minitest::Mock.new
        mock_token_service.expect :encode, token, [Object]
        
        assert_difference("User.count") do
            ::TokenService.stub :new, mock_token_service do
                Time.stub(:now, t_now_utc = Time.now.utc) do
                    session = @subject.register(email: 'tester111@example.com', password: @pass, password_confirmation: @pass, name: 'tester')
                    assert_equal session.token, token
                    assert_equal session.token_expire_at, t_now_utc + TokenBaseAuthService::TOKEN_LIFE_TIME
                    assert_equal session.user, User.last
                end
            end
        end

        mock_token_service.verify
    end
end

class SubjectPartnerTest < ActiveSupport::TestCase
    setup do
        @pass = '0123456789'.freeze
        partner = create(:partner, name: 'partner1', email: 'partner1@exampl.com', slug: 'partner-one')
        @user = create(:instructor, password: @pass, password_confirmation: @pass, partner_id: partner.id)
        @mock_token_cache_store = Minitest::Mock.new
        @subject = ::TokenBaseAuthService.new(Instructor, cache_store: @mock_token_cache_store)
    end

    include TokenBaseAuthServiceTests
end
