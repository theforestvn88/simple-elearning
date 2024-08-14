FactoryBot.define do
  factory :milestone do
    name { "MyString" }
    estimated_minutes { 1 }
    association :course
    association :instructor
  end
end
