interface IssueProps {
	params: {
		id: string
	}
}

const Issue = ({ params }: IssueProps) => {
	return <div>{params.id}</div>
}

export default Issue
