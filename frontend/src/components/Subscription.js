import { connect } from 'react-redux'
import { withPropsOnChange, compose } from 'recompose'

const getEntities = (entityKeys, state, props) => entityKeys.map(
    ({type, key}) => ({
	type,
	value: state[type][props[key]]
    })
)



export default (entityIDsByType, withPropsOnLoad = p => ({})) => {
    
    const entityTypes = Object.keys(entityIDsByType)
    const entityKeys = entityTypes.map(
	type => ({type, key: entityIDsByType[type]})
    )

    return compose(
	connect(
	    (state, props) => {
		const entities = getEntities(entityKeys, state, props)
		const dependencies = entities.reduce(
		    (result, {type, value}) => ({...result, [type]: value}),
		    {}
		)

		return {
		    ...props,
		    ...dependencies,
		    loading: entityTypes.some(key => !dependencies[key])
		}
	    }
	),
	withPropsOnChange(entityTypes, props =>
	    !props.loading ? withPropsOnLoad(props) : {}
	)
    )
}

	
