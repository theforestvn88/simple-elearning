Rails.application.routes.draw do
  root 'home#index'

  namespace :api do
    namespace :v1 do
      resources :users, only: [:show, :update, :destroy]
      resources :instructors, only: [:index, :create, :show, :update, :destroy]

      namespace :partner do
        scope '/:identify' do
          resources :courses, except: [:edit] do
            resources :milestones, only: [:create, :update, :destroy] do
              resources :lessons, only: [:show, :create, :update, :destroy]
            end
          end
          
          resources :assignments, only: [:index, :create, :destroy] do
            collection do
              delete '/cancel', to: 'assignments#cancel'
            end
          end

          post '/presigned_url', to: 'direct_upload#create'

          get '/', to: 'partners#show'
          put '/update', to: 'partners#update'
        end
      end

      scope '/user/*' do
        scope '/courses' do
          # enroll
          # unenroll
          # bookmark
          # ...
        end

        post '/presigned_url', to: 'direct_upload#create', as: :presigned
      end

      scope '/courses' do
        get '/', to: 'courses#query', as: :query_courses
        get '/:id', to: 'courses#show', as: :course_introduction

        scope '/:course_id/:milestone_id/lessons' do
          get '/', to: 'lessons#index', as: :lessons_list
          get '/:id', to: 'lessons#show', as: :lesson_detail
        end
      end
    end

    namespace :auth do
      scope '/user/*' do
        post '/signup', to: 'registrations#create'
        post '/login', to: 'sessions#create'
        delete '/logout', to: 'sessions#destroy'
        post '/refresh_token', to: 'sessions#refresh'
        put '/password/update', to: 'passwords#update'
      end

      scope '/partner/:identify' do
        post '/login', to: 'instructor_sessions#create'
        delete '/logout', to: 'instructor_sessions#destroy'
        post '/refresh_token', to: 'instructor_sessions#refresh'
        put '/password/update', to: 'instructor_passwords#update'
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
