module Api
    module Auth
        module SubjectUser
            def subject_clazz
                ::User
            end

            def cache_store
                nil
            end
        end
    end
end
