Rails.application.routes.draw do
  root 'home#index'

  namespace :api do
    namespace :v1 do
      resources :users, only: [:show, :update, :destroy]
      resources :courses

      post '/presigned_url', to: 'direct_upload#create'
    end

    namespace :auth do
      post '/signup', to: 'registrations#create'
      post '/login', to: 'sessions#create'
      delete '/logout', to: 'sessions#destroy'
      post '/refresh_token', to: 'sessions#refresh'
      put '/password/update', to: 'passwords#update'
    end
  end

  namespace :auth do
      get '/email_verify', to: 'email_verifications#verify'
  end

  namespace :admin do
    resources :courses, only: %i(index show destroy)
    resources :users, only: %i(index show ban destroy)

    root to: "courses#index"
  end

  #
  # TODO: admin 
  # Cron Jobs Controller
  #   require 'sidekiq/web'
  #   require 'sidekiq/cron/web'
  #
  #   mount Sidekiq::Web => '/monitoring/sidekiq'
  #
  #
end
