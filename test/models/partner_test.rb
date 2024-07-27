require "test_helper"

class PartnerTest < ActiveSupport::TestCase
  context 'valications' do
    should validate_presence_of(:email).on(:create)
    should validate_presence_of(:name).on(:create)
  end

  context 'associations' do
    should have_many(:instructors).dependent(:destroy)
    should have_one_attached(:logo)
  end
end
