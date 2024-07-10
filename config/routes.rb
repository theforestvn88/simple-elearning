Rails.application.routes.draw do
  root 'home#index'

  namespace :api do
    namespace :v1 do
      resources :users, only: [:show, :update, :destroy]
      resources :courses
    end

    namespace :auth do
      post '/signup', to: 'registrations#create'
      post '/login', to: 'sessions#create'
      delete '/logout', to: 'sessions#destroy'
      post '/refresh_token', to: 'sessions#refresh'
    end
  end

  namespace :auth do
      get '/email_verify', to: 'email_verifications#verify'
  end
end
