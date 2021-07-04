import React, {useEffect, useState} from 'react'
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getSubject, updateSubject } from "../../../functions/subject";
import SubjectForm from "../../../components/forms/SubjectForm";


const SubjectUpdate = ({history, match}) => {
    const { user } = useSelector((state) => ({ ...state }));
    const [name, setName ] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSubject();
    }, []);

    const loadSubject = () => 
        getSubject(match.params.slug).then((c) => setName(c.data.name));

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(name);
        setLoading(true);
        updateSubject(match.params.slug, { name }, user.token)
        .then(res => {
            setLoading(false);
            setName("");
            toast.success(`"${res.data.name}" is updated`);
            history.push("/admin/subject");
        })
        .catch((err) => {
            console.log(err);
            setLoading(false);
            if (err.response.status === 400) toast.error(err.response.data);
        });
    };

    // const categoryForm = () => (
    //     <form onSubmit={handleSubmit}>
    //         <div className="form-group">
    //             <label>Name</label>
    //             <input
    //                 type="text"
    //                 className="form-control"
    //                 onChange={(e) => setName(e.target.value)}
    //                 value={name}
    //                 autoFocus
    //                 required
    //             />
    //             <br/>
    //             <button className="btn btn-outline-primary">Save</button>
    //         </div>
    //     </form>
    // );
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <br/>
                <div className="col">
                    {loading ? (
                        <h4 className="text-danger">Loading..</h4>
                    ) : (
                        <h4>Update Subject</h4>
                    )}
                        <SubjectForm 
                            handleSubmit={handleSubmit}
                            name={name}
                            setName={setName}
                        />
                    <hr />

                </div>
            </div>
        </div>
    );
};

export default SubjectUpdate;