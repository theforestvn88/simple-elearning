FactoryBot.define do
  factory :instructor do
    sequence(:email) { |n| "instructor#{n}@example.com" }
    password { "0123456789" }
    password_confirmation { "0123456789" }
    name { Faker::Internet.username }
    introduction { "MyText" }
    info { "" }
    rank { "Lecturer" }
    association :partner
  end
end
