FactoryBot.define do
  factory :milestone do
    sequence(:name) { |n| "milestone #{n}" }
    association :course
    association :instructor
  end
end
