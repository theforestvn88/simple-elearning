require "test_helper"

class PartnerTest < ActiveSupport::TestCase
  context 'valications' do
    should validate_presence_of(:email).on(:create)
    should validate_presence_of(:name).on(:create)
    should validate_presence_of(:slug).on(:create)
  end

  context 'associations' do
    should have_many(:instructors).dependent(:destroy)
    should have_many(:courses).dependent(:nullify)
    should have_one_attached(:logo)
  end

  test 'unique slug' do
    assert_raises ActiveRecord::RecordNotUnique do
      Partner.create(email: 'email1@example.com', name: 'partner1', slug: 'same-slug')
      Partner.create(email: 'email2@example.com', name: 'partner2', slug: 'same-slug')
    end
  end
end
