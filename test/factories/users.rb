FactoryBot.define do
  factory :user do
    email { "tester@example.com" }
    password { "0123456789" }
    password_confirmation { "0123456789" }
    name { "tester" }
    verified { false }
  end
end
