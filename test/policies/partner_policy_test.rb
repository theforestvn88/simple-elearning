# frozen_string_literal: true

require 'test_helper'

class PartnerPolicyTest < ActiveSupport::TestCase
    setup do
        @user = create(:user)
        @partner = create(:partner)
        @admin = create(:instructor, partner: @partner, rank: :administrator)
        @professor = create(:instructor, partner: @partner, rank: :professor)
    end

    test 'everyone allowed to view partner info' do
        assert_permit_policy @admin, @partner, :show
        assert_permit_policy @professor, @partner, :show
        assert_permit_policy @user, @partner, :show
    end

    test 'only admin can update partner info' do
        assert_permit_policy @admin, @partner, :update
        refute_permit_policy @professor, @partner, :update
        refute_permit_policy @user, @partner, :update
    end

    test 'no one can create partner' do
        refute_permit_policy @admin, @partner, :create
        refute_permit_policy @professor, @partner, :create
        refute_permit_policy @user, @partner, :create
    end

    test 'no one can delete partner' do
        refute_permit_policy @admin, @partner, :destroy
        refute_permit_policy @professor, @partner, :destroy
        refute_permit_policy @user, @partner, :destroy
    end
end
