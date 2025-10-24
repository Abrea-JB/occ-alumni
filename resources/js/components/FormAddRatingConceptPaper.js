import { Button, Form, Input, Select, Drawer, Space,Layout, message } from "antd";
import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import { useFacultyDashboardStore } from "~/states/facultyDashboardState";
import { useFacultyList } from "~/hooks";

const { Option } = Select;
const { TextArea } = Input;
const FormAddRatingConceptPaper = React.memo(({ submitForm }) => {
    const [form] = Form.useForm(); 
    const [
        isSubmit,
        setSubmit,
        perPage,
        isClear,
        setClear,
        defenseSchedID,
        setDefenseSchedID,
        facultyPanelID,
        setFacultyPanelID,
        panelRating,
        setPanelRating,
        addRatingConceptPaperForm,
        setAddRatingConceptPaperForm,
        thesisID,
        setThesisID,
        defenseThesisDetailsID
    ] = useFacultyDashboardStore(
        (state) => [
            state.isSubmit,
            state.setSubmit,
            state.perPage,
            state.isClear,
            state.setClear,
            state.defenseSchedID,
            state.setDefenseSchedID,
            state.facultyPanelID,
            state.setFacultyPanelID,
            state.panelRating,
            state.setPanelRating,
            state.addRatingConceptPaperForm,
            state.setAddRatingConceptPaperForm,
            state.thesisID,
            state.setThesisID,
            state.defenseThesisDetailsID
        ],
        shallow
    )

    useEffect(() => {
        if (isClear) form.resetFields();
    }, [isClear]);

    
    return (
        <Drawer
            title="Add Concept Paper Presentation Rating"
            width={500}
            open={addRatingConceptPaperForm}
            bodyStyle={{ paddingBottom: 80 }}
            onClose={() => {
                setAddRatingConceptPaperForm(false);
            }}
            extra={
                <Space>
                    <Button onClick={() => {
                        setAddRatingConceptPaperForm(false);
                    }}>Cancel</Button>
                    <Button
                        key="submit"
                        type="primary"
                        loading={isSubmit}
                        onClick={form.submit}
                    >
                        {`Save`}
                    </Button>
                </Space>
            }
        >
            <Form
                style={{marginLeft:'20px'}}
                form={form}
                name="form-concept-paper-rating"
                onFinish={(params) => submitForm(params)}
            >
                <div style={{marginBottom:'px'}}>
                    <Form.Item 
                        name="defenseThesisDetailsID" 
                        label=""
                    >
                        <Input type="hidden" value={defenseThesisDetailsID } />
                    </Form.Item>
                </div>
                <div style={{display:'none'}}>
                    <Form.Item 
                        name="thesis_id" 
                        label=""
                    >
                        <Input type="hidden" value={{ thesisID }} />
                    </Form.Item>
                </div>
                <p>Research Topic</p>
                <Form.Item 
                    name="research_topic" 
                    label=""
                    rules={[
                        {
                            required: true,
                            message: "Please input your rating!",
                        },
                    ]}
                >
                    <Input placeholder="20 is the highest"   maxLength={2} 
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                                }
                        }}
                        onChange={(event) => {
                            if(event.target.value>20){
                                message.error('20 is the highest points!');
                                 form.setFieldsValue({
                                    research_topic: '',
                                });
                            }
                        }}
                    />
                    
                </Form.Item>
                <p>Relevant Literature and Related Existing Application</p>
                <Form.Item 
                    name="relevant_literature" 
                    label=""
                    rules={[
                        {
                            required: true,
                            message: "Please input your rating!",
                        },
                    ]}
                >
                    <Input placeholder="20 is the highest"  maxLength={2}
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                            }
                        }}
                        onChange={(event) => {
                            if(event.target.value>20){
                                message.error('20 is the highest points!');
                                 form.setFieldsValue({
                                    relevant_literature: '',
                                });
                            }
                        }}
                    />
                </Form.Item>
                <p>Issues and Gap</p>
                 <Form.Item 
                    name="issues_gap" 
                    label=""
                    rules={[
                        {
                            required: true,
                            message: "Please input your rating!",
                        },
                    ]}
                >
                    <Input placeholder="20 is the highest"  maxLength={2}
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                            }
                        }}
                        onChange={(event) => {
                            if(event.target.value>20){
                                message.error('20 is the highest points!');
                                 form.setFieldsValue({
                                    issues_gap: '',
                                });
                            }
                        }}
                    />
                </Form.Item>
                <p>Possible Solutions/nhancement and Impact</p>
                <Form.Item 
                    name="possibe_solutions" 
                    label=""
                    rules={[
                        {
                            required: true,
                            message: "Please input your rating!",
                        },
                    ]}
                >
                    <Input placeholder="20 is the highest"  maxLength={2}
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                            }
                        }}
                        onChange={(event) => {
                            if(event.target.value>20){
                                message.error('20 is the highest points!');
                                 form.setFieldsValue({
                                    possibe_solutions: '',
                                });
                            }
                        }}
                    />
                </Form.Item>
                <p>Overall Concept Presentation</p>
                <Form.Item 
                    name="overall_concept" 
                    label=""
                    rules={[
                        {
                            required: true,
                            message: "Please input your rating!",
                        },
                    ]}
                >
                    <Input placeholder="20 is the highest"  maxLength={2}
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                            }
                        }}
                        onChange={(event) => {
                            if(event.target.value>20){
                                message.error('20 is the highest points!');
                                 form.setFieldsValue({
                                    overall_concept: '',
                                });
                            }
                        }}
                    />
                </Form.Item>
                <p>Recommendations</p>
                <Form.Item 
                    name="recommendation" 
                    label=""
                >
                   <Input.TextArea style={{ minHeight: 200 }} rows={8}/>
                </Form.Item>
              
            </Form>
        </Drawer>
    );
});

export default React.memo(FormAddRatingConceptPaper);
