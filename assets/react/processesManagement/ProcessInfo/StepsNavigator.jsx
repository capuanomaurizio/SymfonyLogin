import {Steps} from "antd";

const StepsNavigator = ({page, setPage}) => {
    return(
        <Steps
            type="navigation"
            style={{ backgroundColor: 'white', borderRadius: 10, marginBottom: '1rem' }}
            current={page}
            onChange={(value) => setPage(value)}
            items={[
                {
                    status: 'process',
                    title: 'Informazioni processo',
                },
                {
                    status: 'process',
                    title: 'Componenti processo',
                },
            ]}
        />
    )
}

export default StepsNavigator;
