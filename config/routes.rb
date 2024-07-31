Rails.application.routes.draw do
  root 'home#index'

  namespace :api do
    namespace :v1 do
      resources :users, only: [:show, :update, :destroy]
      resources :courses

      post '/presigned_url', to: 'direct_upload#create'
    end

    namespace :auth do
      scope '/user/*' do
        post '/signup', to: 'registrations#create'
        post '/login', to: 'sessions#create'
        delete '/logout', to: 'sessions#destroy'
        post '/refresh_token', to: 'sessions#refresh'
        put '/password/update', to: 'passwords#update'
      end

      scope '/instructor/:identify' do
        post '/login', to: 'instructor_sessions#create'
        delete '/logout', to: 'instructor_sessions#destroy'
        post '/refresh_token', to: 'instructor_sessions#refresh'
        put '/password/update', to: 'passwords#update'
      end
    end
  end

  namespace :auth do
      get '/email_verify', to: 'email_verifications#verify'
  end

  namespace :partners do
    get "/:slug" => "home#index", as: :page
    root to: "home#index"
  end

  namespace :admin do
    resources :partners, only: %i(index show new create destroy)
    resources :instructors, only: %i(index show new create destroy)
    resources :users, only: %i(index show ban destroy)
    resources :courses, only: %i(index show destroy)

    root to: "partners#index"
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
