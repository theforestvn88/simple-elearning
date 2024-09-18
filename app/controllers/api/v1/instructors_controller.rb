# frozen_string_literal: true

module Api
    module V1
        class InstructorsController < ::PartnerApiController
            before_action :authenticate!, except: [:index, :show]
            before_action :try_authenticate, only: [:index, :show]
            before_action :set_instructor, except: [:index, :create]

            def index
                partner = ::Partner.find_by(slug: params[:partner_slug])
                @instructors = ::Instructor.by_partner(partner.id).search_by(search_params).order_by_rank
                @instructors = @instructors.limit(params[:limit]) if params.has_key?(:limit)
            end

            def show
                authorize @instructor
            end

            def create
                create_instructor_params = instructor_params(CREATE_PARAMS)
                create_instructor_params[:partner_id] = current_user.partner_id

                authorize ::Instructor.new(create_instructor_params)

                result = ::InstructorCreateService.new.call(
                    email: create_instructor_params[:email], 
                    name: create_instructor_params[:name], 
                    partner_id: create_instructor_params[:partner_id],
                    rank: create_instructor_params[:rank]
                )

                if result.success
                    render :show, status: :created, assigns: { 
                        instructor: result.instructor, 
                        instructor_policy: ::InstructorPolicy.new(@current_user, result.instructor)
                    } 
                else
                    render json: result.instructor.errors, status: :unprocessable_entity
                end
            end

            def update
                update_params = instructor_params(UPDATE_PARAMS)
                @instructor.rank = update_params[:rank] if update_params.has_key?(:rank)

                authorize @instructor

                if @instructor.update(update_params)
                    render :show, status: :ok, location: api_v1_user_url(@instructor)
                else
                    render json: @instructor.errors, status: :unprocessable_entity
                end
            end

            def destroy
                authorize @instructor

                @instructor.destroy!
                head :ok
            end

            private

                def set_instructor
                    @instructor = ::Instructor.find(params[:id])
                end

                CREATE_PARAMS = [:email, :rank, :name].freeze
                UPDATE_PARAMS = [:name, :title, :location, :introduction, :avatar, :social_links => [[:id, :name, :link]]].freeze

                def instructor_params(permited_list)
                    permited_params = params.require(:instructor).permit(*permited_list)
                    info = (@instructor&.info || {}).merge(permited_params.extract!(:title, :location, :social_links))
                    permited_params.merge({info: info})
                end

                def search_params
                    params.permit(:by_email_or_name, :by_rank)
                end
        end
    end
end
