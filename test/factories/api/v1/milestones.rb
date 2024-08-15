FactoryBot.define do
  factory :milestone do
    sequence(:name) { |n| "milestone #{n}" }
    estimated_minutes { 1 }
    association :course
    association :instructor
  end
end
