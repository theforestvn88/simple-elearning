Rails.application.routes.draw do
  root 'home#index'

  namespace :api do
    namespace :v1 do
      resources :courses
    end

    namespace :auth do
      post '/signup', to: 'registrations#create'
      post '/login', to: 'sessions#create'
      delete '/logout', to: 'sessions#destroy'
    end
  end

  namespace :auth do
      get '/email_verify', to: 'email_verifications#verify'
  end
end
