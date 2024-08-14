FactoryBot.define do
  factory :lesson do
    name { "MyString" }
    estimated_minutes { 1 }
    association :milestone
    association :course
    association :instructor
  end
end
