module Api
    module V1
        class UsersController < ::ApiController
            before_action :authenticate!, except: [:show]
            before_action :set_user

            def show
                try_authenticate
                authorize @user
            end

            def update
                authorize @user
                
                if @user.update(user_params)
                    render :show, status: :ok, location: api_v1_user_url(@user)
                else
                    render json: @user.errors, status: :unprocessable_entity
                end
            end

            def destroy
                authorize @user

                @user.destroy!
                head :ok
            end

            private

                def set_user
                    @user = User.find(params[:id])
                end

                def user_params
                    params.require(:user).permit(:name, :introduction, :social_links, :location)
                end
        end
    end
end
