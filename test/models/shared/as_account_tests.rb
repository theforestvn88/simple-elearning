require "test_helper"

module Shared
    module AsAccountTests
        extend ActiveSupport::Concern

        included do
            context 'auth' do
                should have_secure_password
            end
        
            context 'valications' do
                should validate_presence_of(:email).on(:create)
                # FIXME: check whether shoulda-matcher is actually support :if lambda or not ?
                should validate_presence_of(:password), if: -> { new_record? || password_digest_changed? }
                should validate_presence_of(:password_confirmation), if: -> { new_record? || password_digest_changed? }
                should validate_presence_of(:name).on(:create)
                should normalize(:email).from(" ME@XYZ.COM\n").to("me@xyz.com")
            end
        
            context 'associations' do
                should have_one_attached(:avatar) 
            end
        end
    end
end
